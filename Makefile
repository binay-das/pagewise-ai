
.PHONY: dev prod down logs pull-models clean

dev:
	docker-compose up -d
	@echo ""
	@echo "Infrastructure started!"
	@echo "   PostgreSQL : localhost:5432"
	@echo "   MinIO API  : localhost:9000"
	@echo "   MinIO UI   : http://localhost:9001"
	@echo "   Ollama     : localhost:11434"
	@echo ""
	@echo "Run 'pnpm dev' to start the Next.js app locally."

prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
	@echo ""
	@echo "Full stack started!"
	@echo "   App        : http://localhost:3000"
	@echo "   MinIO UI   : http://localhost:9001"
	@echo "   Ollama     : localhost:11434"

down:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

logs:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

pull-models:
	docker exec -it pagewise-ollama ollama pull llama3.2:3b
	docker exec -it pagewise-ollama ollama pull nomic-embed-text:v1.5
	@echo "Models ready!"

clean:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v --remove-orphans
	@echo "All containers and volumes removed."
