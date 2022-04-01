import { API, FileInfo } from "jscodeshift";

export const parser = "babel";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.MemberExpression, {
      type: "MemberExpression",
      object: { name: "console" },
    })
    .remove()
    .toSource();
}
