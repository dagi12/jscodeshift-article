import { API, FileInfo } from "jscodeshift";

export const parser = "babel";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const libVarName = root
    .find(j.ImportDeclaration, {
      source: { value: "geometry" },
    })
    .find(j.ImportDefaultSpecifier)
    .get(0).node.local.name;

  root
    .find(j.MemberExpression, {
      object: {
        name: libVarName,
      },
      property: {
        name: "circleArea",
      },
    })
    .replaceWith(({ node }) => ({
      ...node,
      property: j.identifier("getCircleArea"),
    }));

  return root.toSource();
}
