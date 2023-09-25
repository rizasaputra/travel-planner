build-ItineraryImageFunction:
	cp *.py $(ARTIFACTS_DIR)
	cp requirements.txt $(ARTIFACTS_DIR)
	pip3 install -r requirements.txt -t $(ARTIFACTS_DIR) --no-deps
	pip3 install --platform=manylinux2014_x86_64 --only-binary=:all: --python-version 3.9 --implementation cp --target $(ARTIFACTS_DIR) pillow grpcio>=1.45.0