from flask import Flask, request, jsonify
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import Docx2txtLoader
from langchain_community.document_loaders import UnstructuredExcelLoader
import os
import tempfile

class LoaderService: 
    @staticmethod
    def processFile(file, filename):
        file_extension = filename.split('.')[-1].lower()
        try:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file.read())
                temp_file_path = temp_file.name

            if file_extension == 'pdf':
                loader = PyPDFLoader(temp_file_path)
            elif file_extension == 'csv':
                loader = CSVLoader(temp_file_path)
            elif file_extension == 'txt':
                loader = TextLoader(temp_file_path)
            elif file_extension == 'docx':
                loader = Docx2txtLoader(temp_file_path)
            elif file_extension in ('xlsx', 'xls'):
                loader = UnstructuredExcelLoader(temp_file_path, mode="elements")
            else:
                os.remove(temp_file_path)
                return {"error": "Unsupported file type"}, 400

            documents = loader.load()
            os.remove(temp_file_path)  
            documents_summary = [str(doc) for doc in documents]
            return {"message": "File processed successfully", "documents": documents_summary}, 200
        except Exception as e:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)  
            return {"error": str(e)}, 500

