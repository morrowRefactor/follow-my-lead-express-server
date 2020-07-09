function makeRoutesArray() {
    return [
      {
        id: 1,
        route_name: 'Tour Santa Cruz',
        route_summ: 'See the hotspots of Santa Cruz',
        route_type_id: 1,
        location_id: 1
      },
      {
        id: 2,
        route_name: 'Historic Dublin',
        route_summ: 'A historic tour of Dublin',
        route_type_id: 2,
        location_id: 2
      },
      {
        id: 3,
        route_name: 'My Personal Santa Cruz',
        route_summ: 'All my favorite places in SC',
        route_type_id: 3,
        location_id: 1
      }
    ];
}

function makeMaliciousRoute() {
  const maliciousRoute = {
    id: 911,
    route_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    route_summ: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    route_type_id: 1,
    location_id: 2
  }
  const expectedRoute = {
    ...maliciousRoute,
    route_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    route_summ: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    route_type_id: 1,
    location_id: 2
  }
  return {
    maliciousRoute,
    expectedRoute,
  }
}
  
  module.exports = {
    makeRoutesArray,
    makeMaliciousRoute
  }