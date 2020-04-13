import { exec } from '@actions/exec'
import { ExecException } from 'child_process'
import { defaultCoreCipherList } from 'constants'
import * as core from '@actions/core'
import {ExecOptions} from '@actions/exec/lib/interfaces'

export async function getChangesIntroducedByTag(tag: string): Promise<string> {

const previosVersionTag  = await getPreviousVersionTag(tag)


return previosVersionTag
    ? getCommitMessagesBetween(previosVersionTag, tag) : getCommitMessagesFrom(tag)
}

export async function getPreviousVersionTag(tag: string): Promise<string | null> {
    let previousTag = ''

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                previousTag += data.toString()
            }
        },
        silent: true,
        ignoreReturnCode: true
    };

    const exitCode = await exec(
        'git',
        ['describe',
        '--match', 'v[0-9]*',
        '--abbrev=0',
        '--first-parent',
        '${tag}^'],
        options);

    core.debug('The previos version tag is ${previousTag}')

    return exitCode === 0 ? previousTag.trim() : null
}


export async function getCommitMessagesBetween(firstTag: string, secondTag: string): Promise<string> {
let commitMessages = ''

const options: ExecOptions = {
    listeners: {
        stdout: (data: Buffer) => {
            commitMessages += data.toString()
        }
    },
    silent: true
};

await exec(
    'git',
    ['log',
    '--format=%s',
    '${firstTag}..${secondTag}'],
    options);

    core.debug('The commit message between  ${firstTag} and ${secondTag}')

    return commitMessages.trim();
}

export async function getCommitMessagesFrom(tag: string): Promise<string> {
    let commitMessages = ''

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                commitMessages += data.toString()
            }
        },
        silent: true
    };

    await exec(
        'git',
        ['log',
        '--format=%s',
        'tag'],
        options);
    
        core.debug('The commit message from ${tag} are:\n${commitMessages}')
    
        return commitMessages.trim();
}