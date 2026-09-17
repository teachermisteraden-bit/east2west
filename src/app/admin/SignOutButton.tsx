import { signOut } from "@/app/actions/admin";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="btn btn--quiet btn--sm">
        Sign out
      </button>
    </form>
  );
}
