"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";

interface Props {
  shipmentId: string;
  trackingNumber: string;
}

export function DeleteShipment({ shipmentId, trackingNumber }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);

  const canDelete = confirmation.trim().toUpperCase() === trackingNumber.toUpperCase();

  async function remove() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/shipments/${shipmentId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        toast.error("Could not delete shipment", payload.error);
        return;
      }
      toast.success("Shipment deleted", trackingNumber);
      router.push("/admin/shipments");
      router.refresh();
    } catch {
      toast.error("Network error", "Check your connection and try again.");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        variant="danger"
        size="md"
        onClick={() => setOpen(true)}
        icon={<Trash2 aria-hidden className="size-4" />}
      >
        Delete shipment
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete this shipment?"
        description="This removes the shipment and its entire tracking history. Customers holding this tracking number will no longer find it."
        size="sm"
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              disabled={!canDelete}
              loading={deleting}
              onClick={remove}
            >
              Delete permanently
            </Button>
          </>
        }
      >
        <Input
          data-autofocus
          label={`Type ${trackingNumber} to confirm`}
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={trackingNumber}
          className="font-mono"
        />
      </Modal>
    </>
  );
}
