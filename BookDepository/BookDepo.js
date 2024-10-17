// Function to fetch books from Google Books API
async function fetchBooks(queries) {
    const bookPromises = queries.map(query => 
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
    );

    // Wait for all fetch requests to resolve
    const responses = await Promise.all(bookPromises);
    const data = await Promise.all(responses.map(response => response.json()));

    console.log(data)
    
    // Flatten the array and filter out undefined items
    return data.map(item => item.items ? item.items[0]: null);
}

// Function to update a slide with book information
function updateBookSlide(slide, book) {
    const contentWrapper = slide.querySelector('.content-wrapper');
    contentWrapper.innerHTML = ''; // Clear existing content
    
    // Create image element
    const img = document.createElement('img');
    img.src = book.volumeInfo.imageLinks?.thumbnail || 'placeholder-image-url.jpg';
    img.alt = book.volumeInfo.title;
    
    contentWrapper.appendChild(img);
}

// Function to populate the carousel
async function populateCarousel() {
    const carousel = document.getElementById('bookCarousel');
    const slides = carousel.querySelectorAll('.slide');
    const books = await fetchBooks(
        ['albert camus the stranger',
         'albert camus the fall',
         'albert camus the first man',
         'albert camus myth of sisyphus',
         'patrick suskind perfume',
         'osamu dazai no longer human',
         'osamu dazai no the setting sun',
         'franz kafka the metamoorphosis',
         'nabokov valdimir lolita',
         'yoko ogawa hotel iris',
         'friedrich nietzsche beyond good and evil',
         'duke annie thinking in bets',
         'syed hussiein the myth of the lazy native',
        ]); // Pass array of book titles

    console.log(books)

    slides.forEach((slide, index) => {
        if (books[index]) {
            updateBookSlide(slide, books[index]);
        } else {
            console.log(`No book found for slide ${index}`);
        }
    });
}

// Call the function to populate the carousel when the page loads
window.addEventListener('load', populateCarousel);

const carousel = document.getElementById('bookCarousel');

let isScrolling = false; // Prevent rapid scrolling

carousel.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent the default vertical scroll
    if (!isScrolling) {
        isScrolling = true;

        // Calculate the new scroll position
        const scrollAmount = event.deltaY * 1.5; // Adjust the multiplier as needed
        const newScrollPosition = carousel.scrollLeft + scrollAmount;

        // Smoothly scroll to the new position
        carousel.scrollTo({
            left: newScrollPosition,
            behavior: 'smooth', // Enable smooth scrolling behavior
        });

        // Reset the isScrolling flag after a short delay
        setTimeout(() => isScrolling = false, 100); // Adjust timeout as needed
    }
});


