export interface ITemplatesRendererOptions{
    templateName: string,
    variables: Record<string, string>,
}

export interface TemplatesRendererOptions{
    templateName: string,
    variables: Record<string, string>,
}

export interface ISendMailOptions {
    to: string;
    subject: string;
    html: string;
    cc?: string;
    bcc?: string;
}