import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputText, InputTextProps } from '.';

type Props = Partial<InputTextProps>;

const makeInput = (p: Props = {}) => {
  return (
    <InputText
      labelText="label"
      placeholder="placeholder"
      type="text"
      disabled={false}
      required={true}
      readOnly={false}
      {...p}
    />
  );
};

const renderInput = (p?: Props) => {
  const renderResult = render(makeInput(p));
  const input = screen.getByRole('textbox');
  return { input, renderResult };
};

const input = (p?: Props) => renderInput(p).input;

describe('<InputText />', () => {
  describe('default behavior', () => {
    it('renders with label', async () => {
      const el = input({ labelText: 'novo label' });
      const label = screen.getByText('novo label');
      expect(el).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });

    it('renders with placeholder', async () => {
      const el = input({ placeholder: 'novo placeholder' });
      expect(el).toHaveAttribute('placeholder', 'novo placeholder');
    });

    it('renders without placeholder', async () => {
      const el = input({ placeholder: undefined });
      expect(el).not.toHaveAttribute('placeholder');
    });

    it('renders without label', async () => {
      input({ labelText: undefined });
      const label = screen.queryByRole('novo label');
      expect(label).not.toBeInTheDocument();
    });

    it('uses labelText as aria-label when possible', async () => {
      expect(input()).toHaveAttribute('aria-label', 'label');
    });

    it('uses placeholder as aria-label fallback', async () => {
      expect(input({ labelText: undefined })).toHaveAttribute(
        'aria-label',
        'placeholder',
      );
    });

    it('displays default value correctly', async () => {
      expect(input({ defaultValue: 'valor' })).toHaveValue('valor');
    });

    it('accepts other JSX props (name, maxLength)', async () => {
      const el = input({ name: 'name', maxLength: 10 });
      expect(el).toHaveAttribute('name', 'name');
      expect(el).toHaveAttribute('maxLength', '10');
    });
  });

  describe('accessibility', () => {
    it('does not show error message by default', async () => {
      const el = input();
      expect(el).toHaveAttribute('aria-invalid', 'false');
      expect(el).not.toHaveAttribute('aria-describedby');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('does not mark input as invalid by default', async () => {
      const el = input();
      expect(el).toHaveAttribute('aria-invalid', 'false');
    });

    it('renders error message when `errorMessage` is provided', async () => {
      const el = input({ errorMessage: 'Tem erro' });
      const error = screen.getByRole('alert');
      const errorId = error.getAttribute('id');

      expect(el).toHaveAttribute('aria-invalid', 'true');
      expect(el).toHaveAttribute('aria-describedby', errorId);
      expect(error).toBeInTheDocument();
    });
  });

  describe('interactive behavior', () => {
    it('updates value as user types', async () => {
      const user = userEvent.setup();
      const el = input();
      await user.type(el, 'texto');
      expect(el).toHaveValue('texto');
    });
  });

  describe('visual states', () => {
    it('applies visual classes when disabled', async () => {
      const el = input({ disabled: true });
      expect(el).toHaveClass('disabled:bg-slate-200 disabled:text-slate-400');
    });

    it('applies visual classes when readonly', async () => {
      const el = input({ readOnly: true });
      expect(el).toHaveClass('read-only:bg-slate-100');
    });

    it('adds error class (red ring) when invalid', async () => {
      const el = input({ errorMessage: 'Erro' });
      expect(el).toHaveClass('ring-red-500 focus:ring-red-700');
    });

    it('keeps developer custom classes', async () => {
      const el = input({ className: 'custom' });
      expect(el).toHaveClass('custom');
    });
  });
});
