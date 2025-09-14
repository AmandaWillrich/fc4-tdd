import { RefundRuleFactory } from "./refund_rule_factory";
import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund copy";
import { PartialRefund } from "./partial_refund";

describe("Refund Rule Factory", () => {
  it("Deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
    expect(RefundRuleFactory.getRefundRule(8)).toBeInstanceOf(FullRefund);
  });
  it("Deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
    expect(RefundRuleFactory.getRefundRule(7)).toBeInstanceOf(PartialRefund);
    expect(RefundRuleFactory.getRefundRule(1)).toBeInstanceOf(PartialRefund);
  });
  it("Deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
    expect(RefundRuleFactory.getRefundRule(0)).toBeInstanceOf(NoRefund);
  });
});
