export default function parametersToTree(parameters: string[]) {
  let tree: any = {};

  function set(parts: string[], mainTree: any) {
    let current = mainTree;
    for (const item of parts) {
      current[item] = current[item] || {};
      current = current[item];
    }
  }

  parameters.map(parameter => parameter.split('\\')).forEach(parts => set(parts, tree));

  return tree;
}
// parametersToTree(roadmap.goals.map(goal => (goal.indicatorParameter)))