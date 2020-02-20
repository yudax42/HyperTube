FROM ubuntu

WORKDIR /app

RUN apt update -y 2>&1 > /dev/null
RUN apt install curl -y 2>&1 > /dev/null
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt install nodejs -y 2>&1 > /dev/null
RUN npm i -g nodemon

CMD npm i && npm start
