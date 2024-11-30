const query = `query getData{
  hello,
  id,
  isOpen,
  pokemon {
   name,
   abilities {
    ability {
      name
    }
   },
   types {
    type {
      name
    }
   }
   cries {
    latest 
   }
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
  document.querySelector('.imagePlaceholder').innerHTML = '<div class="circle"></div>';
  document.querySelector('.result').innerHTML = "Loading ...";
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
  const abilities = Array.from(data.data.pokemon.abilities);
  const types = data.data.pokemon.types;

  const typeColor = createTypeColor(types)

  const cries = data.data.pokemon.cries.latest;
  if (imageSrc) {
    document.querySelector('.imagePlaceholder').innerHTML = `
        <h3 class='reveal'>${imageAlt}</h3>
        <div class='descriptionBox reveal'>
        <div class='description'><img width='48' src='/images/ability.png' alt='skills' title="Mmorpg icons created by Ken111 - Flaticon" /> <p>${abilities.map(ab => `<span>${ab.ability.name}</span>`).join(' ')}</p>   </div>
        <div class='description'>
          <img width='48' src='/images/type.png' alt='types' title="Pokemon icons created by Darius Dan - Flaticon" />
          <p>${types.map(type => `<span class=${typeColor}>${type.type.name}</span>`).join(' ')}</p> 
        </div>
        </div>
        <img class='reveal' src=${imageSrc} alt=${imageAlt} width='200' height='230' /> <br />
        <audio class='reveal' controls src=${cries}>Your browser doesn't support HTMLAudio elememnt. </audio>
      `;
    const audio = document.querySelector('audio');
    if (audio) {
      audio.volume = .2;
    }
  }
}

function createTypeColor(arr) {
  const type = arr.map(t => t.type.name).join(', ');
  if (type.includes('water')) {
    return 'water'
  }
  else if (type.includes('fire')) {
    return 'fire'
  }
  else if (type.includes('ground')) {
    return 'ground'
  }
  else if (type.includes('fairy')) {
    return 'fairy'
  }
}

function clearData() {
  document.querySelector('.result').innerHTML = '';
  document.querySelector('.imagePlaceholder').innerHTML = '';
}