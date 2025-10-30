# 1. Usar una imagen oficial de Node.js como base.
# Se utilizará una versión LTS (Long Term Support) reciente para mayor estabilidad y seguridad.
FROM node:22-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /workspace/backend

# 3. Copiar los archivos de definición de dependencias.
COPY package*.json ./


# 5. Copiar el resto del código fuente de la aplicación.
COPY . .

# 6. Exponer el puerto que utilizará el servidor Express.
EXPOSE 5001

# 7. Comando por defecto.
# Usamos 'sleep infinity' para asegurar que el contenedor se mantenga vivo.
# Aunque tu docker-compose.yml ya lo define, es una buena práctica
# tener un CMD que no termine inmediatamente.
CMD ["sleep", "infinity"]