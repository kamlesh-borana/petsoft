import Image from "next/image";
import logo from "../../public/logo.svg";
import Link from "next/link";

export default function Logo() {
  // We can also access files from the public folder using normal paths and here we don't have to provide width & height
  return (
    <Link href="/">
      <Image src={logo} alt="PetSoft Logo" />
    </Link>
  );

  // We can access files inside public directly from "/" but it requires us to add width & height
  //   return <Image src={"/logo.svg"} alt="PetSoft Logo" width={33} height={33} />;
}
