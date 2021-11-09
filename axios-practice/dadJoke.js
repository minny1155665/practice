const button = document.querySelector('button');
const jokeContent = document.querySelector('p');

const getJoke = async () => {
    try{
        const header = { headers: { Accept: "application/json" } };
        const joke = await axios.get('https://icanhazdadjoke.com/', header);
        jokeContent.textContent = joke.data.joke;
    } catch{
        jokeContent.textContent = "API downed";
    }
    
}

button.addEventListener('click', getJoke);