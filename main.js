(() => {
    const mainEvent = "CHANGE DATA";
    let temp = [];

    function tambahBuku(e) {
        e.preventDefault();

        const title = document.querySelector('#title');
        const author = document.querySelector('#author');
        const year = document.querySelector('#year');
        const isComplete = document.querySelector('#isComplete');

        let isExist = true;

        [title, author, year].forEach((e, i) => {
            if (e == '') {
                alert(i == 0 ? 'Title is required' : i == 1 ? 'Author is required' : 'Year is required');
                isExist = false;
            }
        })


        if (isExist) {
            const generateId = +new Date();

            const book = {
                id: generateId,
                title: String(title.value),
                author: String(author.value),
                year: parseInt(year.value),
                isComplete: Boolean(isComplete.checked) 
            };

            temp.push(book);
            e.target.reset()
            document.dispatchEvent(new Event(mainEvent));
        }
    }

    function markBook(e) {
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        const index = temp.findIndex((e) => e.id == id);
        temp[index].isComplete = !temp[index].isComplete;

        document.dispatchEvent(new Event(mainEvent));
    }

    function deleteBook(e) {
        const dialog = createDialog();

        document.querySelector('main').appendChild(dialog);
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        const index = temp.findIndex((e) => e.id == id);

        dialog.style.display = 'block';

        const cancelButton = dialog.querySelector('button:nth-child(1)');
        cancelButton.addEventListener('click', () => {
            dialog.style.display = 'none';
        });

        const confirmButton = dialog.querySelector('button:nth-child(2)');
        confirmButton.addEventListener('click', () => {
            dialog.style.display = 'none';
            temp.splice(index, 1);
            document.dispatchEvent(new Event(mainEvent));
        });
    }

    function createDialog() {
        const dialog = document.createElement('div');
        dialog.classList.add('dialog');
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Are you sure?</h3>
                <p>Do you want to delete this book?</p>
                <div class="dialog-action">
                    <button id="cancelBtn">Cancel</button>
                    <button id="confirmBtn">Confirm</button>
                </div>
            </div>
        `;

        return dialog;
    }

    function editBook(e) {
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        const index = temp.findIndex((e) => e.id == id);
        const data = temp[index];

        const editBox = document.createElement('div');
        editBox.id = 'edit-book';
        editBox.innerHTML = `
            <div class="overlay">
                <form class="container">
                    <h3>Edit Book</h3>
                    <div class="form-group">
                        <label for="title">Title</label>
                        <input type="text" id="edit-title" value="${data.title}" placeholder="Book title">
                    </div>

                    <div class="form-group">
                        <label for="author">Author</label>
                        <input type="text" id="edit-author" value="${data.author}" placeholder="Book author">
                    </div>

                    <div class="form-group">
                        <label for="year">Year</label>
                        <input type="number" id="edit-year" value="${data.year}" placeholder="Release year">
                    </div>

                    <div class="checkbox-wrapper-14">
                        <input id="edit-isComplete" type="checkbox" ${data.isComplete ? 'checked' : null} class="switch">
                        <label for="edit-isComplete">Telah Dibaca</label>
                    </div>

                    <button class="addBtn" type="submit" id="editBtn">Edit</button>
                </form>
            </div>
        </div>`;

        document.querySelector('main').appendChild(editBox);

        const form = document.getElementById('edit-book');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.querySelector('#edit-title').value;
            const author = document.querySelector('#edit-author').value;
            const year = document.querySelector('#edit-year').value;
            const isComplete = document.querySelector('#edit-isComplete').checked;

            let isExist = true;

            [title, author, year].forEach((e, i) => {
                if (e == '') {
                    alert(i == 0 ? 'Title is required' : i == 1 ? 'Author is required' : 'Year is required');
                    isExist = false;
                }
            })

            if (isExist) {
                temp[index].title = title;
                temp[index].author = author;
                temp[index].year = year;
                temp[index].isComplete = isComplete;

                document.dispatchEvent(new Event(mainEvent));
                document.querySelector('main').removeChild(editBox);
            }
        })
    }

    function searchBook(e) {
        e.preventDefault();
        const keyword = document.querySelector('#search').value;
        keyword == '' ? renderBook(temp) : renderBook(temp.filter((e) => e.title.toLowerCase().includes(keyword.toLowerCase())));
        e.target.reset();
    }

    function renderBook(e) {
        const a = document.querySelector('.book-list-complete'),
            b = document.querySelector('.book-list-inComplete');

        a.innerHTML = '';
        b.innerHTML = '';

        for (const data of e) {
            const article = document.createElement('article');
            article.classList.add('card-book');
            article.setAttribute('data-id', data.id);

            const card = document.createElement('div');
            card.classList.add('card-body');
            const title = document.createElement('h4');
            title.innerText = data.title;
            const author = document.createElement('p');
            author.innerText = data.author;
            const year = document.createElement('p');
            year.innerText = data.year;

            const action = document.createElement('div');
            action.classList.add('action');

            [data.isComplete ? 'Mark unComplete' : 'Mark Complete', 'Edit', 'Delete'].forEach((e, i) => {
                const btn = document.createElement('button');
                btn.innerText = e;
                btn.addEventListener('click', i == 0 ? markBook : null);
                btn.addEventListener('click', i == 1 ? editBook : null);
                btn.addEventListener('click', i == 2 ? deleteBook : null);
                action.appendChild(btn);
            })

            card.appendChild(title);
            card.appendChild(author);
            card.appendChild(year);
            card.appendChild(action);
            article.appendChild(card);
            article.appendChild(action);

            if (data.isComplete) {
                b.appendChild(article);
            } else {
                a.appendChild(article);
            }
        }
    }

    function storeLocalStorage() {
        localStorage.setItem('data', JSON.stringify(temp));
        renderBook(temp);
    }

    window.addEventListener('load', () => {
        temp = JSON.parse(localStorage.getItem('data')) || [];
        renderBook(temp);

        console.log(JSON.stringify(temp, null, 2));

        const form = document.getElementById('form-store'),
            searchForm = document.querySelector('.search-form');

        form.addEventListener('submit', tambahBuku);
        searchForm.addEventListener('submit', searchBook)

        document.addEventListener(mainEvent, storeLocalStorage)
    })
})()