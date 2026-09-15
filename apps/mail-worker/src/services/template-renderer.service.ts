import { Injectable } from "@nestjs/common";
import * as fs from 'fs/promises';
import * as path from 'path';
import { TemplatesRendererOptions } from "../types/mail.types";

@Injectable()
export class TemplateRendererService {
    private readonly templateDir = path.join(
        process.cwd(),
        'apps/mail-worker/src/templates',
    );

    async render(options: TemplatesRendererOptions): Promise<string> {

        const filePath = path.join(this.templateDir, options.templateName);

        let html = await fs.readFile(filePath, 'utf-8');

        for (const [key, values] of Object.entries(options.variables)) {
            const regex = new RegExp(`#${key}`, 'gi');
            html = html.replace(regex, values);
        }

        return html;
    }

}