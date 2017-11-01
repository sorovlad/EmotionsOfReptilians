@ECHO OFF
docker cp .\uploads\out.jpg snake:/root/openface/i.jpg
docker exec -i snake sh -c "root/openface/demos/classifier.py infer root/openface/generated-embeddings/classifier.pkl root/openface/i.jpg" | findstr "Predict"
