import { useNavigate } from "react-router-dom";
import { Dice5 } from "lucide-react";

const MAX_POKEMON_ID = 1010;

export default function SurpriseButton() {
  const navigate = useNavigate();

  const surpriseMe = () => {
    const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
    navigate(`/pokemon/${id}`);
  };

  return (
    <button
      type="button"
      onClick={surpriseMe}
      className="group relative inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/60 px-4 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition hover:border-primary/40 hover:shadow-md active:scale-[0.98] whitespace-nowrap"
    >
      {/* subtle glow */}
      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 blur-xl transition group-hover:opacity-100"
            style={{ background: "radial-gradient(circle at 30% 30%, rgba(99,102,241,.25), transparent 60%)" }} />

      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary/15">
        <Dice5 className="h-4 w-4" />
      </span>
      <span className="relative">Surprise me</span>
    </button>
  );
}
