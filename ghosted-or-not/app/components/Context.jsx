"use client";

export default function Context({ context, setContext, next, back }) {
  const set = (field, value) => setContext((prev) => ({ ...prev, [field]: value }));

  const isComplete = context.duration && context.met && context.goal;

  const Option = ({ field, value, children }) => (
    <button
      onClick={() => set(field, value)}
      className={`py-3.5 px-4 text-sm font-medium rounded-xl border transition-all duration-300 ${
        context[field] === value
          ? "bg-[#18181b] text-white border-[#18181b] shadow-md transform -translate-y-0.5"
          : "bg-white text-[#52525b] border-[#e4e4e7] hover:border-[#18181b] hover:bg-gray-50 shadow-sm hover:shadow"
      }`}
    >
      {children || value}
    </button>
  );

  return (
    <div className="space-y-10 bg-transparent animate-fade-in">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-serif text-[#09090b] tracking-tight">Context Matters</h2>
        <p className="text-[#52525b] text-sm">
          Give us a tiny bit of background for a more accurate analysis.
        </p>
      </div>

      <div className="space-y-8">
        {/* Duration */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#71717a] uppercase tracking-wider">
            How long have you been talking?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Option field="duration" value="Just met" />
            <Option field="duration" value="Few weeks" />
            <Option field="duration" value="Months+" />
          </div>
        </div>

        {/* Met in person */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#71717a] uppercase tracking-wider">
            Have you met in person?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Option field="met" value="Yes" />
            <Option field="met" value="No" />
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#71717a] uppercase tracking-wider">
            What's your vibe right now?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Option field="goal" value="Just curious">🤔 Curious</Option>
            <Option field="goal" value="I like them">💜 I like them</Option>
            <Option field="goal" value="Worried">😟 Worried</Option>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-8 border-t border-[#e4e4e7] gap-4">
        <button
          onClick={back}
          className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#e4e4e7] text-[#52525b] rounded-full text-sm font-semibold hover:bg-gray-50 hover:border-[#d4d4d8] transition-all shadow-sm"
        >
          Back
        </button>
        <button
          onClick={() => next(context)}
          disabled={!isComplete}
          className="w-full sm:w-auto px-10 py-3.5 bg-[#18181b] text-white rounded-full font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#27272a] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Analyze Chat
        </button>
      </div>
    </div>
  );
}
