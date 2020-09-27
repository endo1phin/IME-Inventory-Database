"""
Various utility functions
"""


from flask import session

def dprint(content):
    """
    Print to docker-compose log for debugging
    """
    if not isinstance(content, str):
        content = str(content)
    print("==============================================\n\n", flush=True)
    print(content, flush=True)
    print("\n\n==============================================", flush=True)


def get_logged_in_user():
    """get logged in user

    Returns:
        dictionary of user's _id, email and fullname
    """
    return session.get('logged_in_user', None)


def flatten_dict(d):
    """
    Given nested, single-key dict, return a list of all keys and value.
    
    For example: {a: {b: c}} => [a, b, c]

    Does not work for dict with multiple keys.
    """
    res = []
    while isinstance(d, dict):
        k = list(d.keys())[0]
        res.append(k)
        d = d[k]
    res.append(d)
    return res




