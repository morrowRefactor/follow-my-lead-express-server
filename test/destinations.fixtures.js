function makeDestinationsArray() {
    return [
      {
        id: 1,
        destination: 'First Stop',
        sequence_num: 1,
        content: 'First stop on this tourist route',
        route_id: 1,
        dest_address:'20 W 34th St',
        dest_lat: '40.748817',
        dest_lng: '-73.985428',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '20 W 34th St'
      },
      {
        id: 2,
        destination: 'Second Stop',
        sequence_num: 2,
        content: 'Second stop on this tourist route',
        route_id: 1,
        dest_address: '2151 Dustin Way',
        dest_lat: '36.9809812',
        dest_lng: '-121.9844785',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '2151 Dustin Way'
      },
      {
        id: 3,
        destination: 'Third Stop',
        sequence_num: 3,
        content: 'Third stop on this tourist route',
        route_id: 1,
        dest_address: '208 Maloney Road',
        dest_lat: '36.9809812',
        dest_lng: '-121.9844785',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '208 Maloney Road'
      },
      {
        id: 4,
        destination: 'First Stop',
        sequence_num: 1,
        content: 'First stop on this historic route',
        route_id: 2,
        dest_address:'20 W 34th St',
        dest_lat: '36.9809812',
        dest_lng: '-121.9844785',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '20 W 34th St'
      },
      {
        id: 5,
        destination: 'Second Stop',
        sequence_num: 2,
        content: 'Second stop on this historic route',
        route_id: 2,
        dest_address: '2151 Dustin Way',
        dest_lat: '36.9809812',
        dest_lng: '-121.9844785',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '2151 Dustin Way'
      },
      {
        id: 6,
        destination: 'Third Stop',
        sequence_num: 3,
        content: 'Third stop on this historic route',
        route_id: 2,
        dest_address: '208 Maloney Road',
        dest_lat: '44.1084964',
        dest_lng: '-72.5958672',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '208 Maloney Road'
      },
      {
        id: 7,
        destination: 'Fourth Stop',
        sequence_num: 4,
        content: 'Fourth stop on this historic route',
        route_id: 2,
        dest_address: '208 Maloney Road',
        dest_lat: '44.1084964',
        dest_lng: '-72.5958672',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '208 Maloney Road'
      },
      {
        id: 8,
        destination: 'First Stop',
        sequence_num: 1,
        content: 'First stop on this personal route',
        route_id: 3,
        dest_address:'20 W 34th St',
        dest_lat: '40.748817',
        dest_lng: '-73.985428',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '20 W 34th St'
      },
      {
        id: 9,
        destination: 'Second Stop',
        sequence_num: 2,
        content: 'Second stop on this personal route',
        route_id: 3,
        dest_address: '2151 Dustin Way',
        dest_lat: '36.9809812',
        dest_lng: '-121.9844785',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '2151 Dustin Way'
      },
      {
        id: 10,
        destination: 'Third Stop',
        sequence_num: 3,
        content: 'Third stop on this personal route',
        route_id: 3,
        dest_address: '208 Maloney Road',
        dest_lat: '44.1084964',
        dest_lng: '-72.5958672',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '208 Maloney Road'
      },
      {
        id: 11,
        destination: 'Fourth Stop',
        sequence_num: 4,
        content: 'Fourth stop on this personal route',
        route_id: 3,
        dest_address:'20 W 34th St',
        dest_lat: '40.748817',
        dest_lng: '-73.985428',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '20 W 34th St'
      },
      {
        id: 12,
        destination: 'Fifth Stop',
        sequence_num: 5,
        content: 'Fifth stop on this personal route',
        route_id: 3,
        dest_address: '2151 Dustin Way',
        dest_lat: '36.9809812',
        dest_lng: '-121.9844785',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '2151 Dustin Way'
      },
    ];
}

function makeMaliciousDestination() {
  const maliciousDestination = {
    id: 911,
    destination: 'Naughty naughty very naughty <script>alert("xss");</script>',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    sequence_num: 1,
    route_id: 2,
    dest_address:'20 W 34th St',
    dest_lat: '40.748817',
    dest_lng: '-73.985428',
    place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
    formatted_address: '20 W 34th St'
  }
  const expectedDestination = {
    ...maliciousDestination,
    destination: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    sequence_num: 1,
    route_id: 2,
    dest_address:'20 W 34th St',
    dest_lat: '40.748817',
    dest_lng: '-73.985428',
    place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
    formatted_address: '20 W 34th St'
  }
  return {
    maliciousDestination,
    expectedDestination,
  }
}
  
  module.exports = {
    makeDestinationsArray,
    makeMaliciousDestination
  }