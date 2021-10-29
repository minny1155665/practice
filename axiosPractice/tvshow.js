const form = document.querySelector('#searchForm');
const list = document.querySelector('#showList');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userSearch = form.elements.query.value;
    const config = { params: {q: userSearch} };
    const results = await axios.get("https://api.tvmaze.com/search/shows", config);
    showResults(results.data);
    form.elements.query.value = '';
})

function showResults(results){
    for (result of results){
        if (result.show.image){
            const show = document.createElement('div');
            const img = document.createElement('img');
            const name = document.createElement('p');
            img.src = result.show.image.medium;
            name.textContent = result.show.name;
            show.append(img);
            show.append(name);
            list.append(show);
        }
    }
}