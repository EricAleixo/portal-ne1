import { Save, X, Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isSubmitting, isEditing, onCancel }: FormActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-3 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg border border-slate-300 transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X className="w-4 h-4" />
        Cancelar
      </button>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-200/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isEditing ? 'Atualizando...' : 'Criando...'}
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isEditing ? 'Atualizar Categoria' : 'Criar Categoria'}
          </>
        )}
      </button>
    </div>
  );
};