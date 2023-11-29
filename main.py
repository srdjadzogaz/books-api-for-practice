from flask import Flask, request, jsonify
from functools import wraps
​
app = Flask(__name__)
# Dictionary to store API keys (replace with a secure storage mechanism in production)
api_keys = {
    "your_api_key": "your_username",  # You can associate a username with each API key if needed
}
​
def require_api_key(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
​
        if api_key and api_key in api_keys:
            # You may perform additional checks, logging, or associate the API key with a user here
            return func(*args, **kwargs)
        else:
            return jsonify({"error": "Unauthorized"}), 401
​
    return decorated_function
​
# Apply API key authentication to all routes
app.before_request(require_api_key)
​
​
# Mock data for books
books = [
    {"id": 1, "title": "Book 1", "author": "Author A"},
    {"id": 2, "title": "Book 2", "author": "Author B"},
    {"id": 2, "title": "Book 2", "author": "Author C"},
]
​
# Example of a route that doesn't require an API key
@app.route('/public', methods=['GET'])
def public_route():
    return "This is a public route!"
​
@app.route('/books', methods=['GET'])
def get_books():
    # Get query parameters
    title_filter = request.args.get('title')
    author_filter = request.args.get('author')
​
    # Get path parameter
    book_id = request.args.get('book_id')
​
    if book_id:
        # If book_id is provided, return the book with the specified ID
        book = next((b for b in books if b["id"] == int(book_id)), None)
        if book:
            return jsonify(book), 200
        else:
            return "Book not found", 404
​
    # Filter books based on query parameters
    filtered_books = books
    if title_filter:
        filtered_books = [b for b in filtered_books if title_filter.lower() in b["title"].lower()]
    if author_filter:
        filtered_books = [b for b in filtered_books if author_filter.lower() in b["author"].lower()]
​
    return jsonify(filtered_books), 200
​
@app.route('/books/<int:book_id>', methods=['GET'])
def get_book_by_id(book_id):
    # Find the book with the specified ID
    book = next((b for b in books if b["id"] == book_id), None)
​
     # Get query parameters
    title_filter = request.args.get('title')
    author_filter = request.args.get('author')
​
# Filter books based on query parameters
    filtered_books = books
    if title_filter:
        filtered_books = [b for b in filtered_books if title_filter.lower() in b["title"].lower()]
    if author_filter:
        filtered_books = [b for b in filtered_books if author_filter.lower() in b["author"].lower()]
​
​
    if book:
        return jsonify(book), 200
    else:
        return "Book not found", 404
​
​
@app.route('/books/<int:book_id>', methods=['GET'])
def get_book_by_id_and_author(book_id):
    # Get query parameters
    author_filter = request.args.get('author')
​
    # Filter books based on the provided book_id and author
    filtered_books = books
​
    if author_filter:
        filtered_books = [b for b in filtered_books if author_filter.lower() in b["author"].lower()]
​
    # If book_id is provided, filter by ID as well
    if book_id:
        filtered_books = [b for b in filtered_books if b["id"] == book_id]
​
    if filtered_books:
        return jsonify(filtered_books), 200
    else:
        return "No matching books found", 404
​
​
if __name__ == '__main__':
    app.run(debug=True)
