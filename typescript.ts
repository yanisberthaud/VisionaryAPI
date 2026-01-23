interface StarWarsPerson {
    name: string;
    height: string;
    gender: string;
    birth_year: string;
}
 
const container = document.querySelector<HTMLElement>('#character-card');
 
async function fetchCharacter() {
  try {
    const response = await fetch('https://swapi.info/api/people/1');
    if (!response.ok) throw new Error('Erreur réseau');
 
    const data: StarWarsPerson = await response.json();
 
    if (container) {
      container.innerHTML = `
                <h2>${data.name}</h2>
                <ul>
                <li>Taille : ${data.height} cm</li>
                <li>Genre : ${data.gender}</li>
                <li>Année de naissance : ${data.birth_year}</li>
                </ul>
            `;
    }
  } catch (error) {
    if (container) {
      container.textContent = 'Impossible de charger le personnage.';
    }
    console.error(error);
  }
}
 
fetchCharacter();