function makeRouteTypesArray() {
    return [
      {
        id: 1,
        route_type: 'Tourist Guide'
      },
      {
        id: 2,
        route_type: 'Historical'
      },
      {
        id: 3,
        route_type: 'Personal'
      }
    ];
};

function makeMaliciousRouteType() {
    const maliciousRouteType = {
      id: 911,
      route_type: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedRouteType = {
      ...maliciousRouteType,
      route_type: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
      maliciousRouteType,
      expectedRouteType,
    };
  };
  
  module.exports = {
    makeRouteTypesArray,
    makeMaliciousRouteType
  };