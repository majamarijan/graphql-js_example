
async function getData() {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: '{ hello, id, isOpen, person { name, id, friends { name, id, friends { name, id} }} }',
    }),
  });
  const data = await response.json();
  document.querySelector('.result').innerHTML = '<pre>' + JSON.stringify(data.data, null, 2) + '</pre>';
}

function clearData() {
  document.querySelector('.result').innerHTML = '';
}