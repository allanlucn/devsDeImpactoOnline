# Como rodar o projeto

1. Crie o ambiente virtual

```
python -m venv venv
```

2. Instale as dependencias

```
pip install -r requirements.txt
```

3. Crie as tabelas no banco

```
python init_db.py (NÃO USA ISSO MAIS)
```

4. Execute o servidor

```
uvicorn main:app --reload
```
