from flask import Flask, request, jsonify, Response
import pandas as pd
import json
import numpy as np


app = Flask(__name__)

def carregar_dados(caminho_arquivo='arrecadacao.csv'):
    df = pd.read_csv(caminho_arquivo, sep=';', encoding='latin1')
    return df

def filtrar_por_ano_e_uf(df, ano=None, uf=None):
    if ano is not None:
        df = df[df['Ano'] == int(ano)]
    if uf is not None:
        df = df[df['UF'] == uf.upper()]
    return df

def tratar_nan_valores(df):
    """
    Substitui valores NaN por None (que se torna null no JSON)
    """
    return df.replace({np.nan: None})

@app.route('/dados/', methods=['POST'])
def get_dados():
    data = request.get_json()
    ano = data.get('ano') if data else None
    uf = data.get('uf') if data else None

    try:
        df = carregar_dados()
        df_filtrado = filtrar_por_ano_e_uf(df, ano=ano, uf=uf)
        df_tratado = tratar_nan_valores(df_filtrado)
        resultado = df_tratado.to_dict(orient='records')
        json_data = json.dumps(resultado, ensure_ascii=False)
        return Response(json_data, content_type="application/json; charset=utf-8")
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


@app.route('/dados/ano/<int:ano>', methods=['GET'])
def get_dados_por_ano(ano):
    try:
        df = carregar_dados()
        df_filtrado = filtrar_por_ano_e_uf(df, ano=ano)
        df_tratado = tratar_nan_valores(df_filtrado)
        resultado = df_tratado.to_dict(orient='records')
        json_data = json.dumps(resultado, ensure_ascii=False)
        return Response(json_data, content_type="application/json; charset=utf-8")
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/dados/por_mes_ano', methods=['POST'])
def get_dados_por_mes_ano():
    data = request.get_json()
    
    if not data:
        return jsonify({'erro': 'Body JSON é obrigatório.'}), 400
        
    ano = data.get('ano')
    mes = data.get('mes', '').strip().capitalize()

    if not ano or not mes:
        return jsonify({'erro': 'Parâmetros "ano" e "mes" são obrigatórios.'}), 400

    try:
        df = carregar_dados()
        df['Mês'] = df['Mês'].astype(str).str.strip().str.capitalize()
        df_filtrado = df[(df['Ano'] == int(ano)) & (df['Mês'] == mes)]
        df_tratado = tratar_nan_valores(df_filtrado)
        resultado = df_tratado.to_dict(orient='records')
        json_data = json.dumps(resultado, ensure_ascii=False)
        return Response(json_data, content_type="application/json; charset=utf-8")
    except Exception as e:
        return jsonify({'erro': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)