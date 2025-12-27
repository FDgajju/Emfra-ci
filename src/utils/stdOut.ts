export const stdOutWrite = (message: string | Uint8Array<ArrayBufferLike>, end = '\n') => {
    process.stdout.write(`${message}${end}`)
}

