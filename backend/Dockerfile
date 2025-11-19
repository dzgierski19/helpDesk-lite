FROM php:8.2-cli

WORKDIR /var/www/backend

RUN apt-get update \
    && apt-get install -y git unzip libzip-dev libsqlite3-dev sqlite3 \
    && docker-php-ext-install pdo pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

CMD ["bash"]
