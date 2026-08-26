from typing import List
from app.api.models.calculator import CalculatorRequest, CalculatorResponse

PLANS_SERVICO = {
    "basico": {"name": "Básico", "price": 197, "monthly": 197},
    "padrao": {"name": "Padrão", "price": 253, "monthly": 253},
    "multibeneficios": {"name": "Multibenefícios", "price": 297, "monthly": 297},
    "essencial": {"name": "Experts Essencial", "price": 453, "monthly": 453},
}

PLANS_COMERCIO = {
    "comercio_basico": {"name": "Comércio Básico", "price": 245, "monthly": 245},
    "comercio_avancado": {"name": "Comércio Avançado", "price": 479, "monthly": 479},
}

BENEFITS_MAP = {
    "basico": ["Plataforma de notas fiscais", "Atendimento via chat e e-mail"],
    "padrao": ["Contabilidade completa", "Plataforma de notas fiscais", "Atendimento via WhatsApp", "Conta PJ gratuita"],
    "multibeneficios": [
        "Certificado digital", "Plataforma de notas fiscais", "Atendimento via WhatsApp",
        "Conta PJ gratuita", "2 benefícios grátis (academia, psicologia, nutrição, seguro, odontológico)",
        "Descontos exclusivos",
    ],
    "essencial": [
        "Certificado digital", "Plataforma de notas fiscais", "Atendimento via WhatsApp e telefone",
        "Conta PJ gratuita", "Assessor dedicado", "Emissão de notas pela equipe",
    ],
    "comercio_basico": [
        "Certificado digital", "Plataforma de notas fiscais", "Atendimento via chat e e-mail",
        "Escrituração fiscal",
    ],
    "comercio_avancado": [
        "Certificado digital", "Plataforma de notas fiscais", "Atendimento via WhatsApp e telefone",
        "Assessor dedicado", "Conciliação bancária", "Relatórios gerenciais",
    ],
}

DESCRIPTIONS = {
    "basico": "Plano essencial para quem está começando.",
    "padrao": "Plano mais popular, com atendimento via WhatsApp e conta PJ gratuita.",
    "multibeneficios": "Melhor custo-benefício com benefícios exclusivos para você e sua equipe.",
    "essencial": "Atendimento personalizado com assessor dedicado e suporte completo.",
    "comercio_basico": "Solução completa para empresas de comércio com escrituração fiscal.",
    "comercio_avancado": "Gestão fiscal avançada com assessor dedicado e relatórios gerenciais.",
}


def determine_plan(request: CalculatorRequest) -> CalculatorResponse:
    is_comercio = request.activity == "comercio"

    if is_comercio:
        if request.employees > 2:
            base_plan = "comercio_avancado"
        else:
            base_plan = "comercio_basico"

        plan = PLANS_COMERCIO.get(base_plan, PLANS_COMERCIO["comercio_basico"])
    else:
        if request.benefits:
            base_plan = "multibeneficios"
        elif request.routine == "assessor" or request.contact == "completo":
            base_plan = "essencial"
        elif request.employees > 2:
            base_plan = "padrao"
        else:
            base_plan = "basico"

        plan = PLANS_SERVICO.get(base_plan, PLANS_SERVICO["basico"])

    price = plan["price"]
    monthly = plan["monthly"]

    if request.employees > 2:
        extra_per_employee = 15 if is_comercio else 10
        extra = (request.employees - 2) * extra_per_employee
        monthly += extra
        price += extra

    if request.routine == "assessor":
        monthly += 50
        price += 50

    if not is_comercio and request.contact == "completo" and base_plan != "essencial":
        monthly += 30
        price += 30

    benefits_list = BENEFITS_MAP.get(base_plan, [])

    return CalculatorResponse(
        recommended_plan=plan["name"],
        price=round(price, 2),
        monthly_price=round(monthly, 2),
        benefits=benefits_list,
        description=DESCRIPTIONS.get(base_plan, ""),
    )
