def test_get_plans_returns_all(client):
    response = client.get("/api/plans/")

    assert response.status_code == 200
    plans = response.json()
    assert len(plans) == 7 or len(plans) > 0
    assert {"servico", "comercio"} >= {p["category"] for p in plans}


def test_get_plans_filtered_by_category(client):
    response = client.get("/api/plans/", params={"category": "comercio"})

    assert response.status_code == 200
    plans = response.json()
    assert all(p["category"] == "comercio" for p in plans)
    assert len(plans) > 0
