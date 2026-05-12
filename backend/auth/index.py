"""Авторизация пользователей: регистрация, вход, выход, проверка сессии"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p66541891_neptune_analytics_3"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod")
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "")

    conn = get_conn()
    cur = conn.cursor()

    # POST register
    if method == "POST" and action == "register":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        name = body.get("name", "").strip()

        if not email or not password or not name:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Заполните все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Email уже зарегистрирован"})}

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
            (email, hash_password(password), name)
        )
        user_id = cur.fetchone()[0]
        session_id = secrets.token_hex(32)
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)", (session_id, user_id))
        conn.commit()

        return {"statusCode": 200, "headers": headers, "body": json.dumps({
            "session_id": session_id, "user": {"id": user_id, "name": name, "email": email}
        })}

    # POST login
    if method == "POST" and action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        cur.execute(f"SELECT id, name, email FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s", (email, hash_password(password)))
        row = cur.fetchone()
        if not row:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Неверный email или пароль"})}

        user_id, name, email = row
        session_id = secrets.token_hex(32)
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)", (session_id, user_id))
        conn.commit()

        return {"statusCode": 200, "headers": headers, "body": json.dumps({
            "session_id": session_id, "user": {"id": user_id, "name": name, "email": email}
        })}

    # GET me
    if method == "GET" and action == "me" or (method == "GET" and not action):
        session_id = event.get("headers", {}).get("X-Session-Id", "")
        if not session_id:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Не авторизован"})}

        cur.execute(
            f"SELECT u.id, u.name, u.email FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id WHERE s.id = %s",
            (session_id,)
        )
        row = cur.fetchone()
        if not row:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Сессия не найдена"})}

        return {"statusCode": 200, "headers": headers, "body": json.dumps({
            "user": {"id": row[0], "name": row[1], "email": row[2]}
        })}

    # POST logout
    if method == "POST" and action == "logout":
        session_id = event.get("headers", {}).get("X-Session-Id", "")
        if session_id:
            cur.execute(f"UPDATE {SCHEMA}.sessions SET user_id = user_id WHERE id = %s", (session_id,))
            conn.commit()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}