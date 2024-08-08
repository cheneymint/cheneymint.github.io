class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
        };

        this.state = false;
        this.messages = [];

        this.cards = [];

        // Load intents and card data

        this.loadCardData();
    }
    loadCardData() {
        fetch('card_data.json')
            .then(response => response.json())
            .then(data => {
                this.cards = data.cards;
            })
            .catch(error => console.error('Error loading card data:', error));
    }
    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    getRandomCardList() {
        var arr = [];
        while (arr.length < 3) {
            var r = Math.floor(Math.random() * 78) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }
        return arr;
    }

    onSendButton(chatbox) {
        // this function should finish with 3 numbers
        let cardList = this.getRandomCardList();

        // Check the console to see that this is an array of 3 numbers
        console.log('picking 3 random cards');
        console.log(cardList);

        // change updateChatImage to receive an array
        this.updateChatImage(chatbox, cardList);

        var textField = chatbox.querySelector('input');
        let text1 = textField.value;

        if (text1 === '') {
            return;
        }

        let msg1 = { name: 'User', message: text1 };
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((r) => {
                if (!r.ok) {
                    throw new Error(`Network response was not ok: ${r.statusText}`);
                }
                return r.json();
            })
            .then((r) => {
                let msg2 = { name: 'Sam', message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                textField.value = '';
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                this.updateChatText(chatbox);
                textField.value = '';
            });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages
            .slice()
            .reverse()
            .forEach(function (item, index) {
                if (item.name === 'Sam') {
                    html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
                } else {
                    html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
                }
            });

        const chatmessage = chatbox.querySelector('.chatbox__messages > div');
        chatmessage.innerHTML = html;
    }

    updateChatImage(chatbox, cardList) {
        const placeholder = document.createElement('div');
        let htmlString =
            '<div class="messages__item messages__item--visitor">' +
            '<img class="card__item--tarot" src="./cards/' +
            cardList[0] +
            '.jpg" alt="" srcset="">' +
            '<img class="card__item--tarot" src="./cards/' +
            cardList[1] +
            '.jpg" alt="" srcset="">' +
            '<img class="card__item--tarot" src="./cards/' +
            cardList[2] +
            '.jpg" alt="" srcset="">' +
            '</div>';

        // Check the console to make sure the HTML is formatted correctly with 3 card images
        console.log('updating the HTML of the placeholder div');
        console.log(htmlString);

        placeholder.innerHTML = htmlString;
        const chatmessage = chatbox.querySelector('.chatbox__messages > div:last-child');
        chatmessage.appendChild(placeholder)
        setTimeout(function () { chatmessage.appendChild(placeholder) }, 100);
        //setTimeout(() => chatmessage.appendChild(placeholder), 1000); // fat arrow function notation
    }
}

const chatbox = new Chatbox();
chatbox.display();
