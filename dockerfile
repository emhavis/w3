FROM nginx:alpine

COPY ./out/ /usr/share/nginx/html/

# ENTRYPOINT [ "/docker-entrypoint.sh" ]
# docker run --rm -it -p 8080:80 emhavis/w3_catalogue:v0.1