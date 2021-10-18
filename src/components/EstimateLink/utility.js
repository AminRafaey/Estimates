export const getAllLinksIdsOfGroup = (surfaceLinks, groupId) => {
  const ids = [];
  if (surfaceLinks[groupId]['surface_fields']) {
    Object.keys(surfaceLinks[groupId]['surface_fields']).map((surfaceId) => {
      Object.keys(
        surfaceLinks[groupId]['surface_fields'][surfaceId]['fields']
      ).map((fieldId) => {
        ids.push(fieldId);
      });
    });
  }
  return ids;
};
