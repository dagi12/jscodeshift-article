import { API, FileInfo } from "jscodeshift";

export const parser = "babel";

export default function transformer(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  const properties = [
    "color",
    "make",
    "model",
    "year",
    "miles",
    "bedliner",
    "alarm",
  ];

  const libVarName = root
    .find(j.ImportDeclaration, {
      source: { value: "car" },
    })
    .find(j.ImportDefaultSpecifier)
    .get(0).node.local.name;

  root
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: { name: libVarName },
        property: { name: "factory" },
      },
    })
    .replaceWith(({ node }) => {
      const newProperties = node.arguments.map((arg: any, index) =>
        j.objectProperty(j.identifier(properties[index]), j.literal(arg.value))
      );
      return {
        ...node,
        arguments: [j.objectExpression(newProperties)],
      };
    });

  return root.toSource();
}
