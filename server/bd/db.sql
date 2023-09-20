CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
[
CREATE TABLE products (
    id SERIAL  PRIMARY KEY ,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    description TEXT
);]

CREATE TABLE user_cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL
);

CREATE TABLE sessions (
    sid VARCHAR PRIMARY KEY NOT NULL,
    sess JSON NOT NULL,
    expire TIMESTAMP(0) NOT NULL
);