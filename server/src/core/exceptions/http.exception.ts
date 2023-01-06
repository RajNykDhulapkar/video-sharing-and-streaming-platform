class HttpException extends Error {
    constructor(
        public readonly message: string,
        public readonly status: number,
        public readonly error?: string
    ) {
        super(message);
    }
}

export default HttpException;
