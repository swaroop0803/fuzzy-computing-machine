<h1>Fuzzy-computing-machine</h1>

<p># name: Run Playwright E2E Tests (Frontend + Backend + MySQL)

# on:

# push:

# branches: [ main ]

# workflow_dispatch:

# jobs:

# playwright-tests:

# runs-on: ubuntu-latest

# services:

# mysql:

# image: mysql:8

# env:

# MYSQL_ROOT_PASSWORD: root

# MYSQL_DATABASE: testdb

# ports:

# - 3306:3306

# options: >-

# --health-cmd="mysqladmin ping --silent"

# --health-interval=10s

# --health-timeout=5s

# --health-retries=5

# steps:

# # 1️⃣ Checkout repo

# - name: Checkout repository

# uses: actions/checkout@v4

# # 2️⃣ Setup Node.js

# - name: Setup Node.js

# uses: actions/setup-node@v4

# with:

# node-version: 20

# # 3️⃣ Install backend dependencies

# - name: Install backend dependencies

# working-directory: ./back-end/server

# run: npm install

# # 4️⃣ Install frontend dependencies

# - name: Install frontend dependencies

# working-directory: ./front-end

# run: npm install

# # 5️⃣ Install e2e test dependencies

# - name: Install Playwright dependencies

# working-directory: ./e2e-tests

# run: |

# npm install

# npx playwright install --with-deps

# # 6️⃣ Initialize database (optional if you have init.sql)

# - name: Initialize MySQL Database

# run: |

# sudo apt-get install -y mysql-client

# sleep 15

# mysql -h 127.0.0.1 -P 3306 -u root -proot -e "CREATE DATABASE IF NOT EXISTS testdb;"

# mysql -h 127.0.0.1 -P 3306 -u root -proot testdb <. back-end/server/init.sql || true

# # 7️⃣ Start backend

# - name: Start backend

# working-directory: ./back-end/server

# run: |

# nohup node server.js > backend.log 2>&1 &

# sleep 8

# # 8️⃣ Start frontend (Vite)

# - name: Start frontend

# working-directory: ./front-end

# run: |

# nohup npm run dev -- --host > frontend.log 2>&1 &

# sleep 8

# # 9️⃣ Run Playwright tests

# - name: Run Playwright Tests

# working-directory: ./e2e-tests

# run: npx playwright test --reporter=line

</p>
