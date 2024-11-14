FROM python:3.12.7-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y  \
&& apt-get install -y build-essential \
&& apt-get install -y libpq-dev

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .