def test_get_plans_returns_all(client):
    response = client.get("/api/plans/")

    assert response.status_code == 200
    plans = response.json()
    assert len(plans) == 8
    assert {"servico", "comercio"} >= {p["category"] for p in plans}
    assert {p["name"] for p in plans} == {"Start", "Smart", "Smart Plus", "Ouro"}


def test_get_plans_returns_sheet_prices_and_features(client):
    response = client.get("/api/plans/", params={"category": "servico"})

    assert response.status_code == 200
    plans = {plan["name"]: plan for plan in response.json()}
    assert {name: plan["price"] for name, plan in plans.items()} == {
        "Start": 197,
        "Smart": 263,
        "Smart Plus": 353,
        "Ouro": None,
    }
    assert plans["Start"]["features"] == [
        "Abertura grátis",
        "Atendimento via chat e e-mail",
        "Plataforma de gestão de impostos",
    ]
    assert "Plataforma de emissão de notas" not in plans["Start"]["features"]
    assert "Conciliação de extrato bancário" in plans["Ouro"]["features"]


def test_get_plans_filtered_by_category(client):
    response = client.get("/api/plans/", params={"category": "comercio"})

    assert response.status_code == 200
    plans = response.json()
    assert all(p["category"] == "comercio" for p in plans)
    assert len(plans) == 4
    assert {p["name"] for p in plans} == {"Start", "Smart", "Smart Plus", "Ouro"}
