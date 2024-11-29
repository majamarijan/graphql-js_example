
const query = `query getData{
  hello,
  id,
  isOpen,
  pokemon {
   name,
   sprites {
    other {
      dream_world {
        front_default
      }
    }
   }
  }
}`;

async function getData() {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  const data = await response.json();
  document.querySelector('.result').innerHTML = '<pre>' + JSON.stringify(data.data, null, 2) + '</pre>';
  const imageSrc = data.data.pokemon.sprites.other.dream_world.front_default;
  const imageAlt = data.data.pokemon.name;
  if (imageSrc) {
    const img = new Image();
    img.width = 200;
    img.src = imageSrc;
    img.alt = imageAlt;
    document.querySelector('.imagePlaceholder').append(img);
  }
}

function clearData() {
  document.querySelector('.result').innerHTML = '';
  document.querySelector('.imagePlaceholder').innerHTML = '';
}