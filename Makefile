
SRC_DIR := ./public
TARGET_DIR := /home/mano/
TARGET_HOST := mano@$(SERVER_IP)

serve:
	zola serve

build:
	zola build

check-env:
ifndef SERVER_IP
	$(error SERVER_IP is undefined. Use `make deploy SERVER_IP=your.ip.here` or export it as environment variable.)
endif

deploy: check-env build
	rsync -avz --delete $(SRC_DIR) $(TARGET_HOST):$(TARGET_DIR)

push:
	git add .
	git commit -m "push via automated script"
	git push origin main

.PHONY: build check-env deploy push
