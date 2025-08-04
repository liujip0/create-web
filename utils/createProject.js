import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export const copyTemplateFilesAndFolders = async (
  source,
  destination,
  projectName
) => {
  const filesAndFolders = await fs.readdir(source);

  for (const entry of filesAndFolders) {
    const currentSource = path.join(source, entry);
    const currentDestination = path.join(destination, entry);

    const stat = await fs.lstat(currentSource);
    if (stat.isDirectory()) {
      if (
        !(
          /node_modules/.test(currentSource) ||
          /dist/.test(currentSource) ||
          /build/.test(currentSource) ||
          /.react-router/.test(currentSource) ||
          /.wrangler/.test(currentSource)
        )
      ) {
        console.log(`Copying directory: ${currentSource}`);
        await fs.mkdir(currentDestination);
        await copyTemplateFilesAndFolders(
          currentSource,
          currentDestination,
          projectName
        );
      } else {
        console.log(`Skipping directory: ${currentSource}`);
      }
    } else {
      if (
        /package.json/.test(currentSource) ||
        /wrangler.jsonc/.test(currentSource) ||
        /deploy-frontend.yaml/.test(currentSource)
      ) {
        console.log(`Copying and modifying file: ${currentSource}`);

        const currentFileContents = await fs.readFile(currentSource, "utf8");
        const newFileContents = currentFileContents.replace(
          /liujip0-web-template/g,
          projectName
        );

        await fs.writeFile(currentDestination, newFileContents, "utf8");
      } else {
        if (
          !(
            /package-lock.json/.test(currentSource) ||
            /pnpm-lock.yaml/.test(currentSource)
          )
        ) {
          console.log(`Copying file: ${currentSource}`);

          await fs.copyFile(currentSource, currentDestination);
        } else {
          console.log(`Skipping file: ${currentSource}`);
        }
      }
    }
  }
};

export const init = async (projectName, projectType) => {
  const destination = path.join(process.cwd(), projectName);

  const source = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../template/" + projectType
  );

  try {
    console.log("Copying template files and folders...");

    await fs.mkdir(destination);
    await copyTemplateFilesAndFolders(source, destination, projectName);

    console.log("Project initialized successfully!");
    console.log(`\ncd ${projectName}\npnpm i\npnpm dev`);
  } catch (error) {
    console.log(error);
  }
};
