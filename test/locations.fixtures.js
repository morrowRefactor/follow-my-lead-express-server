function makeLocationsArray() {
    return [
      {
        id: 1,
        city: 'Santa Cruz',
        state_province: 'California',
        country: 'United States',
        unique_loc: 'Santa-Cruz-California-United-States'
      },
      {
        id: 2,
        city: 'Dublin',
        state_province: 'Leinster',
        country: 'Ireland',
        unique_loc: 'Dublin-Leinster-Ireland'
      }
    ];
}

function makeMaliciousLocation() {
    const maliciousLocation = {
      id: 911,
      city: 'Naughty naughty very naughty <script>alert("xss");</script>',
      state_province: 'Naughty naughty very naughty <script>alert("xss");</script>',
      country: 'Naughty naughty very naughty <script>alert("xss");</script>',
      unique_loc: 'Naughty naughty very naughty <script>alert("xss");</script>'
    }
    const expectedLocation = {
      ...maliciousLocation,
      city: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      state_province: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      country: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      unique_loc: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    }
    return {
      maliciousLocation,
      expectedLocation,
    }
  }
  
  module.exports = {
    makeLocationsArray,
    makeMaliciousLocation
  }