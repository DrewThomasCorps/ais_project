import CrudDao from "./CrudDao";
import Port from "../../models/Port";

/**
 * Functions for reading and manipulating `Port`s.
 */
export default interface PortDao extends CrudDao<Port> {
}
